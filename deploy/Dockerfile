FROM tomcat:9

# Create a non-root user
RUN groupadd -r tomcat && useradd -r -g tomcat -d /usr/local/tomcat -s /sbin/nologin tomcat

# Change ownership of Tomcat directories to the tomcat user
RUN chown -R tomcat:tomcat /usr/local/tomcat

# Copy the modified server.xml from host to container
COPY conf/server.xml /usr/local/tomcat/conf/

# Switch to the tomcat user
USER tomcat

