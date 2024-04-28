package monitoring

import (
	"context"
	"log"
	"os"

	"github.com/newrelic/go-agent/v3/integrations/logcontext-v2/logWriter"
	"github.com/newrelic/go-agent/v3/newrelic"
)

// setup NewRelic
var App *newrelic.Application
var logger *log.Logger
var cfg = []newrelic.ConfigOption{
	newrelic.ConfigAppName("API - Commonly Odd"),
	newrelic.ConfigLicense(os.Getenv("NEW_RELIC_LICENSE_KEY")),
	newrelic.ConfigAppLogEnabled(true),
	newrelic.ConfigAppLogForwardingEnabled(true),
	newrelic.ConfigCodeLevelMetricsEnabled(true),
}

func InitAPM(mainCtx context.Context) {
	var err error
	App, err = newrelic.NewApplication(cfg...)
	if err != nil {
		log.Println("Failed to initialize New Relic APM: ", err)
	} else {
		log.Println("New Relic APM initialized")
	}
	initLogger()
}

func initLogger() {
	writer := logWriter.New(os.Stdout, App)
	writer.DebugLogging(true)
	logger = log.New(writer, "", log.Default().Flags())

}
