package database

import (
	"log"

	"database/sql"

	_ "github.com/lib/pq" // Import the PostgreSQL driver
)

var db *sql.DB

func InitDB(dataSourceName string) {
	var err error
	db, err = sql.Open("postgres", dataSourceName)
	if err != nil {
		log.Fatal(err)
	}
}