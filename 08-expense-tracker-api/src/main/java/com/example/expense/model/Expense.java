package com.example.expense.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class Expense {
    private String id;
    
    @NotBlank(message = "Description is mandatory")
    @Size(max = 500)
    private String description;
    
    @NotNull(message = "Amount is mandatory")
    @DecimalMin(value = "0", inclusive = false, message = "Amount must be positive")
    @Digits(integer = 12, fraction = 2)
    private BigDecimal amount;

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}
