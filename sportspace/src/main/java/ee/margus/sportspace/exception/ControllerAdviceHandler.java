package ee.margus.sportspace.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Date;

@ControllerAdvice
public class ControllerAdviceHandler {

    @ExceptionHandler(GenericException.class)
    public ResponseEntity<ErrorMessage> handleGenericException(GenericException ex) {
        ErrorMessage errorMessage = getErrorMessage(ex.getStatus(), ex);
        return ResponseEntity.status(ex.getStatus()).body(errorMessage);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorMessage> handleBadCredentialsException(BadCredentialsException ex) {
        ErrorMessage errorMessage = getErrorMessage(HttpStatus.UNAUTHORIZED, ex);
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorMessage);
    }

    @ExceptionHandler
    public ResponseEntity<ErrorMessage> handleException(Exception ex) {
        ErrorMessage errorMessage = getErrorMessage(HttpStatus.INTERNAL_SERVER_ERROR, ex);
        errorMessage.setMessage("Something went wrong =(");
        return ResponseEntity.internalServerError().body(errorMessage);
    }

    private ErrorMessage getErrorMessage(HttpStatus status, Exception ex) {
        ErrorMessage errorMessage = new ErrorMessage();
        errorMessage.setStatus(status);
        errorMessage.setMessage(ex.getMessage());
        errorMessage.setDate(new Date());
        return errorMessage;
    }
}
