<?php

namespace App\Http\Controllers;

use App\Http\Requests\VehicleMakeStoreRequest;
use App\Http\Requests\VehicleMakeUpdateRequest;
use App\Models\VehicleMake;
use App\Services\VehicleMakeService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class VehicleMakeController extends Controller
{
    public function __construct(
        protected VehicleMakeService $vehicleMakeService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/makes/index', [
            'makes' => $this->vehicleMakeService->getAll(),
        ]);
    }

    public function store(VehicleMakeStoreRequest $request): RedirectResponse
    {
        $this->vehicleMakeService->create($request->validated('name'));

        return back();
    }

    public function update(VehicleMakeUpdateRequest $request, VehicleMake $make): RedirectResponse
    {
        $this->vehicleMakeService->update($make, $request->validated('name'));

        return back();
    }

    public function destroy(VehicleMake $make): RedirectResponse
    {
        $this->vehicleMakeService->delete($make);

        return back();
    }
}
