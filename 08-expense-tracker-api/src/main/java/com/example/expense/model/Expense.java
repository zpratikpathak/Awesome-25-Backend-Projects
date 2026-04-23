package com.example.expense.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class Expense {
    private String id;
    
    @NotBlank(message = "Description is mandatory")
    private String description;
    
    @NotNull(message = "Amount is mandatory")
    @Min(value = 0, message = "Amount must be positive")
    private Double amount;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}
