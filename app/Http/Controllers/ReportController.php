<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Debt;
use App\Models\Sale;
use App\Models\Categoria;
use App\Models\Provider;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Shuchkin\SimpleXLSXGen;

class ReportController extends Controller
{
    public function statistics()
    {
        $stats = [
            'total_products' => Product::count(),
            'total_sales' => Sale::count(),
            'total_debts' => Debt::count(),
            'total_categories' => Categoria::count(),
            'total_providers' => Provider::count(),
            'total_users' => User::count(),
            'total_stock' => Product::sum('existencias'),
            'total_debt_amount' => Debt::sum('monto'),
            'total_sales_amount' => Sale::sum('total_venta'),
        ];

        return response()->json($stats);
    }

    public function productsReport()
    {
        $products = Product::with(['category', 'provider'])
            ->get()
            ->map(function ($product) {
                return [
                    $product->id,
                    $product->name,
                    $product->description,
                    $product->price,
                    $product->existencias,
                    $product->category ? $product->category->nombre : 'Sin categoría',
                    $product->provider ? $product->provider->name : 'Sin proveedor',
                    $product->created_at->format('d/m/Y H:i'),
                ];
            });

        $xlsx = new SimpleXLSXGen();
        
        // Agregar headers
        $headers = ['ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Categoría', 'Proveedor', 'Fecha Creación'];
        $data = array_merge([$headers], $products->toArray());
        
        $xlsx->addSheet($data, 'Productos');
        
        $filename = 'reporte_productos_' . date('Y-m-d_H-i-s') . '.xlsx';
        
        return response((string)$xlsx, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function debtsReport()
    {
        $debts = Debt::with(['user'])
            ->get()
            ->map(function ($debt) {
                return [
                    $debt->id,
                    $debt->user ? $debt->user->name : 'Sin usuario',
                    $debt->monto,
                    $debt->description,
                    $debt->pagada ? 'Pagada' : 'Pendiente',
                    $debt->created_at->format('d/m/Y H:i'),
                ];
            });

        $xlsx = new SimpleXLSXGen();
        
        // Agregar headers
        $headers = ['ID', 'Usuario', 'Monto', 'Descripción', 'Estado', 'Fecha Creación'];
        $data = array_merge([$headers], $debts->toArray());
        
        $xlsx->addSheet($data, 'Deudas');
        
        $filename = 'reporte_deudas_' . date('Y-m-d_H-i-s') . '.xlsx';
        
        return response((string)$xlsx, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function salesReport()
    {
        $sales = Sale::with(['user'])
            ->get()
            ->map(function ($sale) {
                return [
                    $sale->id,
                    $sale->user ? $sale->user->name : 'Sin usuario',
                    $sale->total_venta,
                    $sale->created_at->format('d/m/Y H:i'),
                ];
            });

        $xlsx = new SimpleXLSXGen();
        
        // Agregar headers
        $headers = ['ID', 'Usuario', 'Total Venta', 'Fecha Venta'];
        $data = array_merge([$headers], $sales->toArray());
        
        $xlsx->addSheet($data, 'Ventas');
        
        $filename = 'reporte_ventas_' . date('Y-m-d_H-i-s') . '.xlsx';
        
        return response((string)$xlsx, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function generalReport()
    {
        $xlsx = new SimpleXLSXGen();

        // Hoja de Productos
        $products = Product::with(['category', 'provider'])
            ->get()
            ->map(function ($product) {
                return [
                    $product->id,
                    $product->name,
                    $product->description,
                    $product->price,
                    $product->existencias,
                    $product->category ? $product->category->nombre : 'Sin categoría',
                    $product->provider ? $product->provider->name : 'Sin proveedor',
                    $product->created_at->format('d/m/Y H:i'),
                ];
            });

        $headers = ['ID', 'Nombre', 'Descripción', 'Precio', 'Stock', 'Categoría', 'Proveedor', 'Fecha Creación'];
        $data = array_merge([$headers], $products->toArray());
        $xlsx->addSheet($data, 'Productos');

        // Hoja de Deudas
        $debts = Debt::with(['user'])
            ->get()
            ->map(function ($debt) {
                return [
                    $debt->id,
                    $debt->user ? $debt->user->name : 'Sin usuario',
                    $debt->monto,
                    $debt->description,
                    $debt->pagada ? 'Pagada' : 'Pendiente',
                    $debt->created_at->format('d/m/Y H:i'),
                ];
            });

        $headers = ['ID', 'Usuario', 'Monto', 'Descripción', 'Estado', 'Fecha Creación'];
        $data = array_merge([$headers], $debts->toArray());
        $xlsx->addSheet($data, 'Deudas');

        // Hoja de Ventas
        $sales = Sale::with(['user'])
            ->get()
            ->map(function ($sale) {
                return [
                    $sale->id,
                    $sale->user ? $sale->user->name : 'Sin usuario',
                    $sale->total_venta,
                    $sale->created_at->format('d/m/Y H:i'),
                ];
            });

        $headers = ['ID', 'Usuario', 'Total Venta', 'Fecha Venta'];
        $data = array_merge([$headers], $sales->toArray());
        $xlsx->addSheet($data, 'Ventas');

        // Hoja de Categorías
        $categories = Categoria::get()
            ->map(function ($category) {
                return [
                    $category->id,
                    $category->nombre,
                    $category->created_at->format('d/m/Y H:i'),
                ];
            });

        $headers = ['ID', 'Nombre', 'Fecha Creación'];
        $data = array_merge([$headers], $categories->toArray());
        $xlsx->addSheet($data, 'Categorías');

        // Hoja de Proveedores
        $providers = Provider::get()
            ->map(function ($provider) {
                return [
                    $provider->id,
                    $provider->name,
                    $provider->email,
                    $provider->phone,
                    $provider->created_at->format('d/m/Y H:i'),
                ];
            });

        $headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Fecha Creación'];
        $data = array_merge([$headers], $providers->toArray());
        $xlsx->addSheet($data, 'Proveedores');

        // Hoja de Resumen
        $summary = [
            ['Métrica', 'Valor'],
            ['Total Productos', Product::count()],
            ['Total Ventas', Sale::count()],
            ['Total Deudas', Debt::count()],
            ['Total Categorías', Categoria::count()],
            ['Total Proveedores', Provider::count()],
            ['Total Usuarios', User::count()],
            ['Stock Total', Product::sum('existencias')],
            ['Monto Total Deudas', Debt::sum('monto')],
            ['Monto Total Ventas', Sale::sum('total_venta')],
            ['', ''],
            ['Fecha del Reporte', date('d/m/Y H:i:s')],
        ];

        $xlsx->addSheet($summary, 'Resumen');
        
        $filename = 'reporte_general_' . date('Y-m-d_H-i-s') . '.xlsx';
        
        return response((string)$xlsx, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
} 