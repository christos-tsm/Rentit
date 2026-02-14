<?php

namespace App\Http\Controllers;

use App\Http\Requests\VehicleCategoryStoreRequest;
use App\Http\Requests\VehicleCategoryUpdateRequest;
use App\Models\VehicleCategory;
use App\Services\VehicleCategoryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VehicleCategoryController extends Controller
{
    public function __construct(
        protected VehicleCategoryService $vehicleCategoryService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/categories/index', [
            'categories' => $this->vehicleCategoryService->getAll(),
        ]);
    }

    public function store(VehicleCategoryStoreRequest $request): RedirectResponse
    {
        $this->vehicleCategoryService->create($request->validated());

        return back();
    }

    public function update(VehicleCategoryUpdateRequest $request, VehicleCategory $category): RedirectResponse
    {
        $this->vehicleCategoryService->update($category, $request->validated());

        return back();
    }

    public function destroy(VehicleCategory $category): RedirectResponse
    {
        $this->vehicleCategoryService->delete($category);

        return back();
    }
}
