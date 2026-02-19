<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookingStoreRequest;
use App\Http\Requests\BookingUpdateRequest;
use App\Models\Booking;
use App\Services\BookingService;
use App\Services\CustomerService;
use App\Services\LocationService;
use App\Services\VehicleCategoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BookingController extends Controller
{
    public function __construct(
        protected BookingService $bookingService,
        protected CustomerService $customerService,
        protected LocationService $locationService,
        protected VehicleCategoryService $vehicleCategoryService,
    ) {}

    public function index(Request $request): Response
    {
        return Inertia::render('bookings/index', [
            'bookings' => $this->bookingService->getAll(
                status: $request->input('status'),
                customerId: $request->input('customer_id'),
            ),
            'filters' => $request->only(['status', 'customer_id']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('bookings/create', [
            'customers' => $this->customerService->getForSelect(),
            'locations' => $this->locationService->getForSelect(),
            'categories' => $this->vehicleCategoryService->getAll(100),
            'extras' => \App\Models\Extra::query()->where('is_active', true)->get(),
        ]);
    }

    public function store(BookingStoreRequest $request): RedirectResponse
    {
        $this->bookingService->create($request->validated());

        return redirect()->route('bookings.index')->with('success', 'Η κράτηση δημιουργήθηκε με επιτυχία.');
    }

    public function show(Booking $booking): Response
    {
        $booking = $this->bookingService->find($booking->id);

        return Inertia::render('bookings/show', [
            'booking' => $booking,
        ]);
    }

    public function update(BookingUpdateRequest $request, Booking $booking): RedirectResponse
    {
        $this->bookingService->update($booking, $request->validated());

        return back()->with('success', 'Η κράτηση ενημερώθηκε με επιτυχία.');
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $this->bookingService->delete($booking);

        return redirect()->route('bookings.index')->with('success', 'Η κράτηση διαγράφηκε.');
    }
}
