{
  "/ohe": {
    "post": {
      "summary": "Post new open house event",
      "description": "Create a new open house event to the system",
      "parameters": [
        {
          "name": "body",
          "in": "body",
          "schema": {
            "$ref": "#/definitions/openHouseEvent"
          }
        },
        {
          "name": "x-user-profile",
          "in": "header",
          "required": true,
          "type": "string",
          "description": "Stringified JSON object with the user's profile information"
        }
      ],
      "tags": [
        "oheController",
        "authenticated"
      ],
      "responses": {
        "201": {
          "description": "Open house event created succesfully",
          "schema": {
            "$ref": "#/definitions/openHouseEvent"
          }
        },
        "default": {
          "description": "Unexpected error",
          "schema": {
            "$ref": "#/definitions/Error"
          }
        }
      }
    }
  }
} 
