package gov.nih.nci.nbia.restUtil;

import javax.ws.rs.core.Response;
import java.util.Map;
import java.util.Set;

public class ParameterValidator {

    public static Response validateParameters(Map<String, String[]> queryParams, Set<String> validParams) {
        StringBuilder invalidParams = new StringBuilder();

        for (String param : queryParams.keySet()) {
            if (!validParams.contains(param)) {
                if (invalidParams.length() > 0) {
                    invalidParams.append(", ");
                }
                invalidParams.append(param);
            }
        }

        if (invalidParams.length() > 0) {
            String errorMessage = "Invalid parameter(s): " + invalidParams +
                                  ". Valid parameters are: " + validParams;
            return Response.status(400).entity(errorMessage).build();
        }

        return null; // No invalid parameters
    }
}