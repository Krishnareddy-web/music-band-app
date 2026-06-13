import { create } from 'zustand';

interface BookingState {
    isBooking: boolean;
    timeLeft: number;
    eventId: string | null;
    bookingId: string | null;
    startBooking: (eventId: string) => Promise<void>;
    resetBooking: () => void;
    decrementTimer: () => void;
    confirmBooking: (favoriteSongs: string[], details: { address: string; location: string; phone: string }) => Promise<boolean>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
    isBooking: false,
    timeLeft: 0,
    eventId: null,
    bookingId: null,

    startBooking: async (eventId) => {
        try {
            const res = await fetch("/api/bookings/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId })
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                console.error("Failed to start booking:", errorData.error || res.statusText);
                alert(errorData.error || "Failed to start booking. Please try again.");
                return;
            }

            const data = await res.json();
            const expiresAt = new Date(data.expiresAt).getTime();
            const now = Date.now();
            const secondsLeft = Math.max(0, Math.floor((expiresAt - now) / 1000));

            set({
                isBooking: true,
                timeLeft: secondsLeft,
                eventId,
                bookingId: data.bookingId
            });

        } catch (error) {
            console.error("Error starting booking:", error);
        }
    },

    resetBooking: () => set({ isBooking: false, timeLeft: 0, eventId: null, bookingId: null }),

    decrementTimer: () => set((state) => {
        if (state.timeLeft <= 0) {
            if (state.isBooking) {
                // Auto-reset if time runs out
                return { isBooking: false, timeLeft: 0, eventId: null, bookingId: null };
            }
            return { timeLeft: 0 };
        }
        return { timeLeft: state.timeLeft - 1 };
    }),

    confirmBooking: async (favoriteSongs: string[], details: { address: string; location: string; phone: string }) => {
        const { bookingId } = get();
        if (!bookingId) return false;

        try {
            const res = await fetch("/api/bookings/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingId,
                    favoriteSongs: favoriteSongs.join(", "),
                    clientAddress: details.address,
                    eventLocation: details.location,
                    clientPhone: details.phone
                })
            });

            if (res.ok) return true;
            return false;
        } catch (error) {
            console.error("Error confirming booking:", error);
            return false;
        }
    }
}));
