package main

import (
  "log"
  "net/http"
)

func main() {
  fs := http.FileServer(http.Dir("./"))
  http.Handle("/", fs)

  log.Println("Listening on :1234...")
  err := http.ListenAndServe(":1234", nil)
  if err != nil {
    log.Fatal(err)
  }
}
