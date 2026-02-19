<?php

namespace App\Http\Controllers;

use App\Http\Requests\DriverAgeSurchargeStoreRequest;
use App\Http\Requests\DriverAgeSurchargeUpdateRequest;
use App\Models\DriverAgeSurcharge;
use App\Services\DriverAgeSurchargeService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DriverAgeSurchargeController extends Controller
{
    public function __construct(
        protected DriverAgeSurchargeService $driverAgeSurchargeService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/pricing/age-surcharges/index', [
            'driver_age_surcharges' => $this->driverAgeSurchargeService->getAll(),
        ]);
    }

    public function store(DriverAgeSurchargeStoreRequest $request): RedirectResponse
    {
        $this->driverAgeSurchargeService->create($request->validated());

        return back()->with('success', 'Age surcharge created successfully.');
    }

    public function update(DriverAgeSurchargeUpdateRequest $request, DriverAgeSurcharge $ageSurcharge): RedirectResponse
    {
        $this->driverAgeSurchargeService->update($ageSurcharge, $request->validated());

        return back()->with('success', 'Age surcharge updated successfully.');
    }

    public function destroy(DriverAgeSurcharge $ageSurcharge): RedirectResponse
    {
        $this->driverAgeSurchargeService->delete($ageSurcharge);

        return back()->with('success', 'Age surcharge deleted successfully.');
    }
}
