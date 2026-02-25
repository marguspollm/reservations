package ee.margus.sportspace.exception;

import org.springframework.http.HttpStatus;

public class ValidationException extends GenericException{
    public ValidationException(String message){
        super(message, HttpStatus.BAD_REQUEST);
    }
}
