#!/usr/bin/env bash
#   Use this script to test if a given TCP host/port are available

WAITFORIT_cmdname=${0##*/}

echoerr() { if [[ $WAITFORIT_QUIET -ne 1 ]]; then echo "$@" 1>&2; fi }

usage()
{
    exitcode="$1"
    cat << USAGE >&2
Usage:
    $WAITFORIT_cmdname host:port [-s] [-t timeout] [-- command args]
    -h HOST | --host=HOST       Host or IP under test
    -p PORT | --port=PORT       TCP port under test
    -s | --strict               Only execute subcommand if the test succeeds
    -q | --quiet                Don't output any status messages
    -t TIMEOUT | --timeout=TIMEOUT
                                Timeout in seconds, zero for no timeout
    -- COMMAND ARGS             Execute command with args after the test finishes
USAGE
    exit "$exitcode"
}

wait_for()
{
    if [[ $WAITFORIT_TIMEOUT -gt 0 ]]; then
        echoerr "$WAITFORIT_cmdname: waiting $WAITFORIT_TIMEOUT seconds for $WAITFORIT_HOST:$WAITFORIT_PORT"
    else
        echoerr "$WAITFORIT_cmdname: waiting for $WAITFORIT_HOST:$WAITFORIT_PORT without a timeout"
    fi
    WAITFORIT_start_ts=$(date +%s)
    while :
    do
        if [[ $WAITFORIT_ISBUSY -eq 1 ]]; then
            nc -z $WAITFORIT_HOST $WAITFORIT_PORT
            WAITFORIT_result=$?
        else
            (echo > /dev/tcp/$WAITFORIT_HOST/$WAITFORIT_PORT) >/dev/null 2>&1
            WAITFORIT_result=$?
        fi
        if [[ $WAITFORIT_result -eq 0 ]]; then
            WAITFORIT_end_ts=$(date +%s)
            echoerr "$WAITFORIT_cmdname: $WAITFORIT_HOST:$WAITFORIT_PORT is available after $((WAITFORIT_end_ts - WAITFORIT_start_ts)) seconds"
            break
        fi
        sleep 1
    done
    return $WAITFORIT_result
}

wait_for_wrapper()
{
    # In order to support SIGINT during timeout: http://unix.stackexchange.com/a/57692
    if [[ $WAITFORIT_QUIET -eq 1 ]]; then
        timeout $WAITFORIT_CMD $WAITFORIT_HOST $WAITFORIT_PORT $WAITFORIT_ISBUSY $WAITFORIT_TIMEOUT &
    else
        timeout $WAITFORIT_CMD $WAITFORIT_HOST $WAITFORIT_PORT $WAITFORIT_ISBUSY $WAITFORIT_TIMEOUT & wait $!
    fi
    WAITFORIT_result=$?
    if [[ $WAITFORIT_result -ne 0 ]]; then
        echoerr "$WAITFORIT_cmdname: timeout occurred after waiting $WAITFORIT_timeout seconds for $WAITFORIT_HOST:$WAITFORIT_PORT"
    fi
    return $WAITFORIT_result
}

# process arguments
while [[ $# -gt 0 ]]
do
    case "$1" in
        *:* )
        WAITFORIT_hostport=(${1//:/ })
        WAITFORIT_HOST=${WAITFORIT_hostport[0]}
        WAITFORIT_PORT=${WAITFORIT_hostport[1]}
        shift 1
        ;;
        -h | --host)
        WAITFORIT_HOST="$2"
        if [[ $WAITFORIT_HOST == "" ]]; then break; fi
        shift 2
        ;;
        -p | --port)
        WAITFORIT_PORT="$2"
        if [[ $WAITFORIT_PORT == "" ]]; then break; fi
        shift 2
        ;;
        -s | --strict)
        WAITFORIT_STRICT=1
        shift 1
        ;;
        -q | --quiet)
        WAITFORIT_QUIET=1
        shift 1
        ;;
        -t | --timeout)
        WAITFORIT_TIMEOUT="$2"
        if [[ $WAITFORIT_TIMEOUT == "" ]]; then break; fi
        shift 2
        ;;
        --)
        shift
        WAITFORIT_cmd=("$@")
        break
        ;;
        --help)
        usage 0
        ;;
        *)
        echoerr "Unknown argument: $1"
        usage 1
        ;;
    esac
done

if [[ "$WAITFORIT_HOST" == "" || "$WAITFORIT_PORT" == "" ]]; then
    echoerr "Error: you need to provide a host and port to test."
    usage 2
fi

WAITFORIT_TIMEOUT=${WAITFORIT_TIMEOUT:-15}
WAITFORIT_STRICT=${WAITFORIT_STRICT:-0}
WAITFORIT_QUIET=${WAITFORIT_QUIET:-0}

WAITFORIT_ISBUSY=0
if command -v nc >/dev/null 2>&1; then
    WAITFORIT_ISBUSY=1
fi

wait_for

WAITFORIT_result=$?

if [[ $WAITFORIT_cmd != "" ]]; then
    if [[ $WAITFORIT_result -ne 0 && $WAITFORIT_STRICT -eq 1 ]]; then
        echoerr "$WAITFORIT_cmdname: strict mode, refusing to execute subprocess"
        exit $WAITFORIT_result
    fi
    exec "${WAITFORIT_cmd[@]}"
else
    exit $WAITFORIT_result
fi
