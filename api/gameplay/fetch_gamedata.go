package gameplay

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/kolourr/commonlyodd/database"
	"github.com/lib/pq"
)

type ObjectSimilarity struct {
	Id     int
	Obj1   string
	Obj2   string
	Obj3   string
	Obj4   string
	Odd    string
	Reason string
}

// fetchRandomQuestion retrieves a random question while avoiding repeats
func fetchRandomQuestion(sessionUUID string) (map[string]string, error) {
	usedIds, err := fetchUsedObjectSimilarityIds(sessionUUID)
	if err != nil {
		return nil, fmt.Errorf("error fetching used object similarity IDs: %w", err)
	}

	objSim, err := fetchRandomObjectSimilarity(sessionUUID, usedIds)
	if err != nil {
		return nil, fmt.Errorf("error fetching random object similarity: %w", err)
	}

	imageLinks, err := fetchObjectImageLinks(objSim)
	if err != nil {
		return nil, fmt.Errorf("error fetching object image links: %w", err)
	}

	// Combine object names and image links into one map
	combinedData := map[string]string{
		"obj1":      objSim.Obj1,
		"obj2":      objSim.Obj2,
		"obj3":      objSim.Obj3,
		"obj4":      objSim.Obj4,
		"img_link1": imageLinks[objSim.Obj1],
		"img_link2": imageLinks[objSim.Obj2],
		"img_link3": imageLinks[objSim.Obj3],
		"img_link4": imageLinks[objSim.Obj4],
		"odd":       objSim.Odd,
		"reason":    objSim.Reason,
	}

	return combinedData, nil
}

// fetchUsedObjectSimilarityIds retrieves a list of used object similarity IDs for the session.
func fetchUsedObjectSimilarityIds(sessionUUID string) ([]int, error) {
	var usedIds []int

	query := `
        SELECT object_similarity_id FROM session_objects
        WHERE session_id = (SELECT session_id FROM game_sessions WHERE session_uuid = $1)`
	rows, err := database.DB.Query(query, sessionUUID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		if err := rows.Scan(&id); err != nil {
			return nil, err
		}
		usedIds = append(usedIds, id)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return usedIds, nil
}

// fetchRandomObjectSimilarity fetches a random object similarity record that hasn't been used.
func fetchRandomObjectSimilarity(sessionUUID string, usedIds []int) (ObjectSimilarity, error) {
	var objSim ObjectSimilarity
	var err error

	sessionIdQuery := `SELECT session_id FROM game_sessions WHERE session_uuid = $1`
	var sessionId int
	err = database.DB.QueryRow(sessionIdQuery, sessionUUID).Scan(&sessionId)
	if err != nil {
		return objSim, fmt.Errorf("error fetching session ID: %w", err)
	}

	if len(usedIds) == 0 {
		// If no IDs have been used, select any record
		query := `
            SELECT id, obj_1, obj_2, obj_3, obj_4, odd, reason_for_similarity FROM objects_similarity
            ORDER BY RANDOM()
            LIMIT 1`
		err = database.DB.QueryRow(query).Scan(&objSim.Id, &objSim.Obj1, &objSim.Obj2, &objSim.Obj3, &objSim.Obj4, &objSim.Odd, &objSim.Reason)
	} else {
		// If there are used IDs, exclude them
		query := `
            SELECT id, obj_1, obj_2, obj_3, obj_4, odd, reason_for_similarity FROM objects_similarity
            WHERE id != ALL($1)
            ORDER BY RANDOM()
            LIMIT 1`
		err = database.DB.QueryRow(query, pq.Array(usedIds)).Scan(&objSim.Id, &objSim.Obj1, &objSim.Obj2, &objSim.Obj3, &objSim.Obj4, &objSim.Odd, &objSim.Reason)
	}

	if err != nil {
		if err == sql.ErrNoRows {
			// No unused object similarities found, return a zero value of ObjectSimilarity and no error
			return ObjectSimilarity{}, nil
		}
		// An actual error occurred, return it
		return ObjectSimilarity{}, fmt.Errorf("error fetching random object similarity: %w", err)
	}

	// Insert the selected object similarity ID into session_objects
	insertQuery := `
        INSERT INTO session_objects (session_id, object_similarity_id, used_at)
        VALUES ($1, $2, $3)`
	_, err = database.DB.Exec(insertQuery, sessionId, objSim.Id, time.Now())
	if err != nil {
		return ObjectSimilarity{}, fmt.Errorf("error inserting into session_objects: %w", err)
	}

	return objSim, nil
}

// fetchObjectImageLinks retrieves the image links for the given object similarity record.
func fetchObjectImageLinks(objSim ObjectSimilarity) (map[string]string, error) {
	imageLinks := make(map[string]string)

	objs := []string{objSim.Obj1, objSim.Obj2, objSim.Obj3, objSim.Obj4}
	for _, obj := range objs {
		query := `SELECT img_link FROM object_images WHERE obj_name = $1`
		var imgLink string
		err := database.DB.QueryRow(query, obj).Scan(&imgLink)
		if err != nil {
			if err == sql.ErrNoRows {
				// No image link found for this object, continue to the next one
				continue
			} else {
				// An actual error occurred, return it
				return nil, err
			}
		}
		imageLinks[obj] = imgLink
	}

	return imageLinks, nil
}
