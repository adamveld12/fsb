package store

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	log "gopkg.in/adamveld12/lopher.v1"
)

const getGamesEndpoint = "https://multiplayer.factorio.com/get-games?username=%s&token=%s"
const getGamesDetailsEndpoint = "https://multiplayer.factorio.com/get-game-details/%d"
const authenticateEndpoint = "https://auth.factorio.com/api-login?username=%s&password=%s&requre_game_ownership=true"

var client *http.Client
var logger log.Logger

func init() {
	client = &http.Client{
		Timeout: time.Second * 5,
	}

	logger = log.New(os.Stdout, false, log.LFUTC|log.LFshortfile)
}

// NewFactorioAPIClient creates a new api client using a token so auth isn't necessary
func NewFactorioAPIClient(username, token string) (FactorioAPI, error) {
	if username == "" || token == "" {
		return nil, errors.New("username or token are empty strings")
	}

	return &factorioServerBrowserAPI{logger, username, token}, nil
}

type FactorioAPI interface {
	Games() ([]byte, error)
	Details(gameID int) ([]byte, error)
}

type factorioServerBrowserAPI struct {
	log.Logger
	username string
	token    string
}

func (f *factorioServerBrowserAPI) Games() ([]byte, error) {
	url := fmt.Sprintf(getGamesEndpoint, f.username, f.token)
	response, err := client.Get(url)

	if err != nil {
		f.Debugf("Failed to call %s --- %+v", url, err.Error())
		return nil, fmt.Errorf("Could not make API call to get games: %+v", err)
	}
	defer response.Body.Close()

	d, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("Could not read response %+v", err)
	}

	if response.StatusCode != 200 {
		return nil, fmt.Errorf("Recieved bad response %s %+v", d, err)
	}

	return d, nil
}

func (f *factorioServerBrowserAPI) Details(gameID int) ([]byte, error) {
	url := fmt.Sprintf(getGamesDetailsEndpoint, gameID)
	response, err := client.Get(url)

	if err != nil {
		f.Debugf("Failed to call %s --- %+v", url, err.Error())
		return nil, fmt.Errorf("Could not make API call to get game details: %+v", err)
	}
	defer response.Body.Close()

	d, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return nil, fmt.Errorf("Could not read response %+v", err)
	}

	if response.StatusCode != 200 {
		return nil, fmt.Errorf("Recieved bad response %s %+v", d, err)
	}

	return d, nil
}
