# 🚌 AI Bus Finder

An AI-powered bus search application built using **Spring Boot, Ollama, and Qwen2.5:3B**.

The application allows users to search for buses using natural language instead of traditional search filters.

For example:

> "I want a sleeper bus from Madurai to Chennai between 6 PM and 11 PM"

The AI extracts the required search details and Spring Boot returns the matching buses.

---

## 🚀 Features

- 🔹 Natural language bus search
- 🔹 AI-powered query understanding using Ollama
- 🔹 Qwen2.5:3B local LLM integration
- 🔹 Source and destination extraction
- 🔹 Departure time range extraction
- 🔹 Bus type filtering
- 🔹 Java-based bus filtering
- 🔹 Simple responsive web interface
- 🔹 REST API using Spring Boot

---

## 🛠️ Technologies Used

- Java 21
- Spring Boot 4.1.1
- Spring Web
- Maven
- Ollama
- Qwen2.5:3B
- HTML
- CSS
- JavaScript

---

## 🏗️ Architecture

```text
User
  ↓
HTML / JavaScript UI
  ↓
Spring Boot REST API
  ↓
Ollama + Qwen2.5:3B
  ↓
Natural Language → JSON
  ↓
SearchRequest
  ↓
BusService
  ↓
Matching Bus Results
