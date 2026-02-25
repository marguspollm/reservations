package ee.margus.sportspace.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class GenericException extends RuntimeException {
    private final HttpStatus status;
    protected GenericException(String message, HttpStatus status){
        super(message);
        this.status = status;
    }
}
