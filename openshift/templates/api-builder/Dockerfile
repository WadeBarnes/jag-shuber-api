# Pull in nodejs-8 centos container
FROM centos/nodejs-8-centos7

# Installs Java under root user
USER root

RUN yum install -y java-1.8.0-openjdk && \
    yum clean all

USER 1001

ENV JAVA_HOME /usr/lib/jvm/java-8-openjdk-amd64/

# Temp Directory for downloads
RUN TMPDIR="$HOME/tmp" && \
    mkdir -p $TMPDIR && \
    cd $TMPDIR

# Install Yarn and Add it to the path
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
ENV PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$JAVA_HOME/bin:$PATH"

# Install liquibase, postgres driver
ENV LIQUIBASE_ROOT="$HOME/liquibase"
RUN mkdir $LIQUIBASE_ROOT && \
    curl -SLo liquibase.tar.gz https://github.com/liquibase/liquibase/releases/download/liquibase-parent-3.5.3/liquibase-3.5.3-bin.tar.gz && \  
    tar -xzf liquibase.tar.gz -C $LIQUIBASE_ROOT && \
    chmod 755 $LIQUIBASE_ROOT/liquibase && \
    curl -SLO https://jdbc.postgresql.org/download/postgresql-42.2.1.jre7.jar && \
    mv postgresql-42.2.1.jre7.jar $LIQUIBASE_ROOT/lib

# Add Liquibase to path
ENV PATH="${LIQUIBASE_ROOT}:${PATH}"

# Cleanup
RUN cd / && \
    rm -rf $TMPDIR

# Set the PORT so that our node app starts on 8080
ENV PORT=8080
