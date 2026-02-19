<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookingTimeAdjustmentStoreRequest;
use App\Http\Requests\BookingTimeAdjustmentUpdateRequest;
use App\Models\BookingTimeAdjustment;
use App\Services\BookingTimeAdjustmentService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BookingTimeAdjustmentController extends Controller
{
    public function __construct(
        protected BookingTimeAdjustmentService $bookingTimeAdjustmentService,
    ) {}

    public function index(): Response
    {
        return Inertia::render('admin/pricing/time-adjustments/index', [
            'booking_time_adjustments' => $this->bookingTimeAdjustmentService->getAll(),
        ]);
    }

    public function store(BookingTimeAdjustmentStoreRequest $request): RedirectResponse
    {
        $this->bookingTimeAdjustmentService->create($request->validated());

        return back()->with('success', 'Time adjustment created successfully.');
    }

    public function update(BookingTimeAdjustmentUpdateRequest $request, BookingTimeAdjustment $timeAdjustment): RedirectResponse
    {
        $this->bookingTimeAdjustmentService->update($timeAdjustment, $request->validated());

        return back()->with('success', 'Time adjustment updated successfully.');
    }

    public function destroy(BookingTimeAdjustment $timeAdjustment): RedirectResponse
    {
        $this->bookingTimeAdjustmentService->delete($timeAdjustment);

        return back()->with('success', 'Time adjustment deleted successfully.');
    }
}
