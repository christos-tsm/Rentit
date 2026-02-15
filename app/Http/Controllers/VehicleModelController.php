<?php

namespace App\Http\Controllers;

use App\Http\Requests\VehicleModelStoreRequest;
use App\Http\Requests\VehicleModelUpdateRequest;
use App\Models\VehicleModel;
use App\Services\VehicleMakeService;
use App\Services\VehicleModelService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VehicleModelController extends Controller
{
    public function __construct(
        protected VehicleModelService $vehicleModelService,
        protected VehicleMakeService $vehicleMakeService,
    ) {}

    public function index(Request $request): Response
    {
        $makeId = $request->integer('make_id') ?: null;

        return Inertia::render('admin/models/index', [
            'models' => $this->vehicleModelService->getAll($makeId),
            'makes' => $this->vehicleMakeService->getAll(),
            // 'makes' => Inertia::lazy(fn() => $this->vehicleMakeService->getAll()),
            'selectedMakeId' => $makeId,
        ]);
    }

    public function store(VehicleModelStoreRequest $request): RedirectResponse
    {
        $this->vehicleModelService->create(
            $request->validated('vehicle_make_id'),
            $request->validated('name'),
        );

        return back()->with('success', 'Το μοντέλο δημιουργήθηκε με επιτυχία.');
    }

    public function update(VehicleModelUpdateRequest $request, VehicleModel $vehicleModel): RedirectResponse
    {
        $this->vehicleModelService->update(
            $vehicleModel,
            $request->validated('vehicle_make_id'),
            $request->validated('name'),
        );

        return back()->with('success', 'Το μοντέλο ενημερώθηκε με επιτυχία.');
    }

    public function destroy(VehicleModel $vehicleModel): RedirectResponse
    {
        $this->vehicleModelService->delete($vehicleModel);

        return back()->with('success', 'Το μοντέλο διαγράφηκε με επιτυχία.');
    }
}
