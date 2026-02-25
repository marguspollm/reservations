package ee.margus.sportspace.exception;

import org.springframework.http.HttpStatus;

public class ConflictException extends GenericException{
    public ConflictException(String message){
        super(message, HttpStatus.CONFLICT);
    }
}
