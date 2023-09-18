package gov.nih.nci.nbia.restAPI;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import gov.nih.nci.nbia.security.UnauthorizedException;

@Provider
public class UnauthorizedExceptionMapper implements ExceptionMapper<UnauthorizedException> {
    public UnauthorizedExceptionMapper() {
        System.out.println("Jersey UnauthorizedExceptionMapper loaded!");
    }

    @Override
    public Response toResponse(UnauthorizedException exception) {
        System.out.println("we got here......jersey exception handler");
        return Response.status(Response.Status.UNAUTHORIZED).build();
    }
}
