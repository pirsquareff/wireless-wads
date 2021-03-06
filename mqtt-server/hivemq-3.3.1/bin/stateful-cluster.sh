#!/bin/bash
echo -------------------------------------------------------------------------
echo
echo '                  _    _  _              __  __   ____'
echo '                 | |  | |(_)            |  \/  | / __ \ '
echo '                 | |__| | _ __   __ ___ | \  / || |  | |'
echo '                 |  __  || |\ \ / // _ \| |\/| || |  | |'
echo '                 | |  | || | \ V /|  __/| |  | || |__| |'
echo '                 |_|  |_||_|  \_/  \___||_|  |_| \___\_\'
echo
echo "-------------------------------------------------------------------------"
echo ""
echo "  HiveMQ Start Script for Linux/Unix v1.7"
echo ""

if hash java 2>/dev/null; then

    ############## VARIABLES
    JAVA_OPTS="$JAVA_OPTS -Djava.net.preferIPv4Stack=true"
    JAVA_OPTS="$JAVA_OPTS -XX:-UseSplitVerifier -noverify"
    JAVA_OPTS="$JAVA_OPTS -DstatefulCluster=true"

    if [ -c "/dev/urandom" ]; then
        # Use /dev/urandom as standard source for secure randomness if it exists
        JAVA_OPTS="$JAVA_OPTS -Djava.security.egd=file:/dev/./urandom"
    fi

    # Uncomment for enabling JMX Monitoring
    #JAVA_OPTS="$JAVA_OPTS -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.port=9010 -Dcom.sun.management.jmxremote.local.only=false -Dcom.sun.management.jmxremote.authenticate=false -Dcom.sun.management.jmxremote.ssl=false"

    # Uncomment for enabling Diagnostic Mode
    #JAVA_OPTS="$JAVA_OPTS -DdiagnosticMode=true"

    if [ -z "$HIVEMQ_HOME" ]; then
        HIVEMQ_FOLDER="$( cd "$( dirname "${BASH_SOURCE[0]}" )/../" && pwd )"
        HOME_OPT="-Dhivemq.home=$HIVEMQ_FOLDER"
    else
        HIVEMQ_FOLDER=$HIVEMQ_HOME
        HOME_OPT=""
    fi

    if [ ! -d "$HIVEMQ_FOLDER" ]; then
        echo ERROR! HiveMQ Home Folder not found.
    else

        if [ ! -w "$HIVEMQ_FOLDER" ]; then
            echo ERROR! HiveMQ Home Folder Permissions not correct.
        else

            if [ ! -f "$HIVEMQ_FOLDER/bin/hivemq.jar" ]; then
                echo ERROR! HiveMQ JAR not found.
                echo $HIVEMQ_FOLDER;
            else
                HIVEMQ_FOLDER=$(echo "$HIVEMQ_FOLDER" | sed 's/ /\\ /g')
                JAVA_OPTS="$JAVA_OPTS -XX:OnOutOfMemoryError='sleep 5; kill -9 %p'"
                JAVA_OPTS="$JAVA_OPTS -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=$HIVEMQ_FOLDER/heap-dump.hprof"

                echo "-------------------------------------------------------------------------"
                echo ""
                echo "  HIVEMQ_HOME: $HIVEMQ_FOLDER"
                echo ""
                echo "  JAVA_OPTS: $JAVA_OPTS"
                echo ""
                echo "-------------------------------------------------------------------------"
                echo ""
                # Run HiveMQ
                JAR_PATH="$HIVEMQ_FOLDER/bin/hivemq.jar"
                eval \"java\" "$HOME_OPT" "$JAVA_OPTS" -jar "$JAR_PATH"
            fi
        fi
    fi

else
    echo You do not have the Java Runtime Environment installed, please install Java JRE from java.com/en/download and try again.
fi
