<?php

namespace App\Http\Controllers;

use App\Http\Requests\DurationDiscountStoreRequest;
use App\Http\Requests\DurationDiscountUpdateRequest;
use App\Models\DurationDiscount;
use App\Services\DurationDiscountService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DurationDiscountController extends Controller
{
    public function __construct(
        protected DurationDiscountService $durationDiscountService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/pricing/duration-discounts/index', [
            'duration_discounts' => $this->durationDiscountService->getAll(),
        ]);
    }

    public function store(DurationDiscountStoreRequest $request): RedirectResponse
    {
        $this->durationDiscountService->create($request->validated());

        return back()->with('success', 'Duration discount created successfully.');
    }

    public function update(DurationDiscountUpdateRequest $request, DurationDiscount $durationDiscount): RedirectResponse
    {
        $this->durationDiscountService->update($durationDiscount, $request->validated());

        return back()->with('success', 'Duration discount updated successfully.');
    }

    public function destroy(DurationDiscount $durationDiscount): RedirectResponse
    {
        $this->durationDiscountService->delete($durationDiscount);

        return back()->with('success', 'Duration discount deleted successfully.');
    }
}
