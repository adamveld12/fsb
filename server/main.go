package main

import (
	"crypto/tls"
	"fmt"
	"os"
	"strconv"

	"golang.org/x/crypto/acme/autocert"

	"github.com/adamveld12/fsb/server/store"

	"net/http"

	log "gopkg.in/adamveld12/lopher.v1"
	"gopkg.in/kelseyhightower/envconfig.v1"
	"gopkg.in/pressly/chi.v2"

	_ "gopkg.in/go-sql-driver/mysql.v1"
)

func main() {
	c := Config{}
	envconfig.MustProcess("fsb", &c)

	l := log.New(os.Stderr, c.Debug, log.LFshortfile|log.LFUTC|log.LFtime|log.LFdate)

	l.Infof("Running w/ %+v", c)

	mux := chi.NewRouter()

	mux.Use(func(h http.Handler) http.Handler {
		return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
			header := res.Header()
			header.Set("Access-Control-Allow-Origin", c.Origin)
			h.ServeHTTP(res, req)
		})
	})

	store, err := store.New(c.Factorio_Username, c.Factorio_Token, c.Redis, c.Debug)
	if err != nil {
		l.Info("Could not create store", err)
		panic(err)
	}

	mux.Get("/api/v1", func(res http.ResponseWriter, req *http.Request) {
		h := res.Header()
		h.Set("Cache-Control", "public, max-age=360000")
		res.Write([]byte("/api/v1:\n\ngames: gets a list of games from factorio\ndetails?gameId=<gameId>: gets details about the game from factorio"))
	})

	mux.Get("/api/v1/details", func(res http.ResponseWriter, req *http.Request) {
		id := req.URL.Query().Get("gameId")
		gameID, err := strconv.Atoi(id)
		if err != nil {
			l.Info("didn't get a game id query param")
			http.Error(res, "query param gameId is required and must be a number", http.StatusBadRequest)
		}

		details, err := store.LoadGameDetails(gameID)
		if err != nil {
			l.Info("failed loading games: ", err)
			http.Error(res, "Could not load game details", http.StatusNotFound)
		}

		h := res.Header()
		h.Set("Content-Type", "application/json")
		h.Set("Content-Encoding", "gzip")
		h.Set("Cache-Control", "public, max-age=300")
		res.Write(details)
	})

	mux.Get("/api/v1/games", func(res http.ResponseWriter, req *http.Request) {
		games, err := store.LoadGames()
		if err != nil {
			l.Info("failed loading games: ", err)
		}

		h := res.Header()
		h.Set("Content-Type", "application/json")
		h.Set("Content-Encoding", "gzip")
		h.Set("Cache-Control", "public, max-age=60")
		res.Write(games)
	})

	go func() {
		certManager := autocert.Manager{
			Prompt:     autocert.AcceptTOS,
			HostPolicy: autocert.HostWhitelist("fsb-api.veldhousen.ninja", "fsbapi.veldhousen.ninja"),
			Cache:      autocert.DirCache("certs"),
		}

		server := &http.Server{
			Addr:    ":443",
			Handler: mux,
			TLSConfig: &tls.Config{
				GetCertificate: certManager.GetCertificate,
			},
		}
		server.ListenAndServeTLS("", "")

	}()

	addr := fmt.Sprintf(":%d", c.Port)
	if err := http.ListenAndServe(addr, mux); err != nil {
		l.Info("FATAL SERVER EXIT", err)
		return
	}
}

// Config knows things
type Config struct {
	// Port is the port the HTTP server binds to
	Port int

	// Origin is URL allowed to access this API
	Origin string

	// FactorioUsername for factorio api
	Factorio_Username string

	// FactorioToken for factorio api
	Factorio_Token string

	// Redis
	Redis string

	// Debug if we should write debug output
	Debug bool
}
