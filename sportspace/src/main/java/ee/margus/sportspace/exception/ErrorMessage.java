package ee.margus.sportspace.exception;

import lombok.Data;
import org.springframework.http.HttpStatus;

import java.util.Date;

@Data
public class ErrorMessage {
    private String message;
    private HttpStatus status;
    private Date date;
}
