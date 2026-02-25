package ee.margus.sportspace.listener;

import ee.margus.sportspace.entity.Reservation;
import ee.margus.sportspace.event.ReservationCreatedEvent;
import ee.margus.sportspace.event.ReservationStatusUpdatedEvent;
import ee.margus.sportspace.repository.ReservationRepository;
import ee.margus.sportspace.service.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class ReservationListener {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private MailService mailService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleCreated(ReservationCreatedEvent event) throws InterruptedException {

        Reservation reservation =
            reservationRepository.findById(event.reservationId()).orElseThrow();

        mailService.notifySuperAdmins(reservation);
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleStatusUpdated(ReservationStatusUpdatedEvent event) {

        Reservation reservation =
            reservationRepository.findById(event.reservationId()).orElseThrow();

        mailService.notifyUser(reservation);
    }
}
