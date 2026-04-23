package com.example.expense.controller;

import com.example.expense.model.Expense;
import com.example.expense.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @Autowired
    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<Expense> getAll() {
        return expenseService.getAllExpenses();
    }

    @PostMapping
    public ResponseEntity<Expense> create(@Valid @RequestBody Expense expense) {
        return ResponseEntity.ok(expenseService.addExpense(expense));
    }
}
