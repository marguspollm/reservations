package ee.margus.sportspace.service;

import ee.margus.sportspace.entity.Reservation;
import ee.margus.sportspace.entity.User;
import ee.margus.sportspace.model.Role;
import ee.margus.sportspace.repository.UserRepository;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class MailService {
    @Autowired
    private JavaMailSender mailSender;
    @Autowired
    private UserRepository userRepository;

    private void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Failed to send email: " + e.getMessage());
        }
    }

    public void notifySuperAdmins(Reservation reservation) throws InterruptedException {
        List<User> superAdmins = userRepository.findByRolesIn(Collections.singleton(Role.SUPERADMIN));
        String subject = "New reservation created!";
        String body = getAdminEmailBody(reservation);

        for (User admin : superAdmins) {
            sendEmail(admin.getEmail(), subject, body);
            Thread.sleep(1000);
        }
    }

    public void notifyUser(Reservation reservation) {
        String subject = "Reservation status updated - " + reservation.getStatus().toString();
        String body = getUserEmailBody(reservation);

        sendEmail(reservation.getUser().getEmail(), subject, body);
    }

    private String getAdminEmailBody(Reservation reservation) {
        return "<html>" +
            "<body>" +
            "<h2>New Reservation Created</h2>" +
            "<p>Venue: " + reservation.getRoom().getFacility().getName() + "</p>" +
            "<p>Room: " + reservation.getRoom().getName() + "</p>" +
            "<p>User: " + reservation.getUser().getFullName() + "</p>" +
            "</body>" +
            "</html>";
    }

    private String getUserEmailBody(Reservation reservation) {
        return "<html>" +
            "<body>" +
            "<h2>Reservation Status Updated</h2>" +
            "<p>Your reservation: " + reservation.getTitle() + " is now <b>"
            + reservation.getStatus() + "</b>.</p>" +
            "</body>" +
            "</html>";
    }
}
