package gov.nih.nci.nbia.restAPI;

import gov.nih.nci.nbia.security.UnauthorizedException;
import gov.nih.nci.nbia.restUtil.InvalidParametersException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalExceptionHandler {
    public GlobalExceptionHandler() {
        System.out.println("Swing GlobalExceptionHandler loaded!");
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED) // 401
    @ExceptionHandler(UnauthorizedException.class)
    public void handleUnauthorized() {
        // Handle the exception
        System.out.println("Got to Swing UnauthorizedException handler");
    }

    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY) // 401
    @ExceptionHandler(InvalidParametersException.class)
    public void handleInvalidParameters() {
        // Handle the exception
        System.out.println("Got to Swing InvalidParametersException handler");
    }
}