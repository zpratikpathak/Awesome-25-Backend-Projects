package com.example.expense.service;

import com.example.expense.model.Expense;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ExpenseService {
    private final List<Expense> expenses = new ArrayList<>();

    public synchronized List<Expense> getAllExpenses() {
        return List.copyOf(expenses);
    }

    public synchronized Expense addExpense(Expense expense) {
        expense.setId(UUID.randomUUID().toString());
        expenses.add(expense);
        return expense;
    }
}
