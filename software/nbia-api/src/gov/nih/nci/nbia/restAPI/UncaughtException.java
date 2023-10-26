package gov.nih.nci.nbia.restAPI;

import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import gov.nih.nci.nbia.util.NCIAConfig;
import java.io.PrintWriter;
import java.io.StringWriter;

@Provider
public class UncaughtException extends Throwable implements ExceptionMapper<Throwable> {
    private static final long serialVersionUID = 1L;

    @Override
    public Response toResponse(Throwable exception) {
        System.out.println(NCIAConfig.includeExceptionsInErrors());
        if (NCIAConfig.includeExceptionsInErrors()) {
            StringWriter sw = new StringWriter();
            exception.printStackTrace(new PrintWriter(sw));
            String exceptionAsString = sw.toString();
            return Response.status(500).entity(exception.getMessage() + "\n" + exceptionAsString).type("text/plain").build();
        }
        return Response.status(500).entity("Server was not able to process your request" + "\n" + exception.getMessage()).type("text/plain").build();
    }
}