<?php

namespace App\Http\Controllers;

use App\Http\Requests\FeeStoreRequest;
use App\Http\Requests\FeeUpdateRequest;
use App\Models\Fee;
use App\Services\FeeService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class FeeController extends Controller
{
    public function __construct(
        protected FeeService $feeService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/pricing/fees/index', [
            'fees' => $this->feeService->getAll(),
        ]);
    }

    public function store(FeeStoreRequest $request): RedirectResponse
    {
        $this->feeService->create($request->validated());

        return back()->with('success', 'Fee created successfully.');
    }

    public function update(FeeUpdateRequest $request, Fee $fee): RedirectResponse
    {
        $this->feeService->update($fee, $request->validated());

        return back()->with('success', 'Fee updated successfully.');
    }

    public function destroy(Fee $fee): RedirectResponse
    {
        $this->feeService->delete($fee);

        return back()->with('success', 'Fee deleted successfully.');
    }
}
