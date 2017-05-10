package store

import (
	"bytes"
	"compress/gzip"
	"fmt"
	"os"
	"time"

	"github.com/go-redis/redis"
	log "gopkg.in/adamveld12/lopher.v1"
)

type Store interface {
	LoadGames() ([]byte, error)
	LoadGameDetails(int) ([]byte, error)
}

func New(username, token, connstr string, debug bool) (Store, error) {
	rc := redis.NewClient(&redis.Options{
		Addr:     connstr,
		Password: "",
		DB:       0,
	})

	l := log.New(os.Stderr, debug, log.LFUTC|log.LFshortfile)

	_, err := rc.Ping().Result()
	if err != nil {
		l.Debug("Could not ping redis", err)
		return nil, err
	}

	api, err := NewFactorioAPIClient(username, token)
	if err != nil {
		l.Debug("Could not create api client:", api)
		return nil, err
	}

	return &redisStore{l, rc, api}, nil
}

type redisStore struct {
	log.Logger
	rc  *redis.Client
	api FactorioAPI
}

func compress(data []byte) []byte {
	bf := &bytes.Buffer{}
	w, _ := gzip.NewWriterLevel(bf, gzip.BestCompression)
	defer w.Close()

	w.Write(data)
	w.Flush()

	return bf.Bytes()
}

func (r *redisStore) loadIfCached(key string) []byte {
	rc := r.rc
	exists := rc.Exists(key)
	if exists.Val() == 0 {
		r.Debugf("'%s' - MISS", key)
		return nil
	}

	result := rc.Get(key)
	b, err := result.Bytes()
	if err != nil {
		return nil
	}

	r.Debugf("'%s' - HIT", key)

	return b
}

func (r *redisStore) cachePayload(key string, payload []byte, ttl time.Duration) error {
	rc := r.rc

	if err := rc.Set(key, payload, ttl).Err(); err != nil {
		r.Debugf("Could not cache '%s': %+v", key, err)
		return fmt.Errorf("Could not cache data %+v", err)
	}

	r.Debugf("caching '%s' for %+v", key, ttl)
	return nil
}

func (r *redisStore) LoadGames() ([]byte, error) {
	api := r.api

	payload := r.loadIfCached("games")
	if payload != nil {
		r.Debug("cached payload found")
		return payload, nil
	}

	r.Debug("hitting api for fresh data...")
	games, err := api.Games()
	if err != nil {
		r.Debug("Could not load games")
		return nil, err
	}

	cpayload := compress(games)
	if string(games) == "[]" || string(games) == "" {
		r.Debugf("'%s' - PASS: uncacheable payload %s", "games", string(games))
		return cpayload, nil
	}

	if err := r.cachePayload("games", cpayload, time.Minute); err != nil {
		r.Debug("could not cache payload", err)
		return nil, err
	}

	return cpayload, nil
}

// LoadGameDetails loads game details from cache
func (r *redisStore) LoadGameDetails(gameID int) ([]byte, error) {
	api := r.api

	key := fmt.Sprintf("game-%d", gameID)
	payload := r.loadIfCached(key)
	if payload != nil {
		return payload, nil
	}

	gameDeets, err := api.Details(gameID)
	if err != nil {
		r.Debug("Could not load details for %s %+v", gameID, err)
		return nil, err
	}

	cpayload := compress(gameDeets)
	if string(gameDeets) == "[]" || string(gameDeets) == "" {
		return cpayload, nil
	}

	if err := r.cachePayload(key, cpayload, time.Minute*5); err != nil {
		r.Debug("could not cache payload", err)
		return nil, err
	}

	return cpayload, nil
}
