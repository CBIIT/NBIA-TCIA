package gov.nih.nci.nbia.restAPI;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

import gov.nih.nci.nbia.restUtil.InvalidParametersException;

@Provider
public class InvalidParametersMapper implements ExceptionMapper<InvalidParametersException> {
    public InvalidParametersMapper() {
        System.out.println("Jersey InvalidParametersMapper loaded!");
    }

    @Override
    public Response toResponse(InvalidParametersException exception) {
        System.out.println("we got here......jersey InvalidParametersException handler");
        return Response.status(422).build();
    }
}
