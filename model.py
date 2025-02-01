from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import numpy as np

def generate_suggestions(transactions, user_profile):
    # Feature Engineering
    X = np.array([[t['amount'], 
                   t['date'].timestamp(), 
                   category_map[t['category']], 
                   t['weekday'], 
                   t['hour_of_day']] 
                  for t in transactions])
    
    # Normalize features for better clustering
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    # Find optimal clusters
    best_k = find_optimal_clusters(X_scaled)

    # Perform K-means clustering
    kmeans = KMeans(n_clusters=best_k, random_state=42)
    clusters = kmeans.fit_predict(X_scaled)
    
    # Analyze clusters
    cluster_insights = analyze_clusters(transactions, clusters)
    
    # Generate personalized suggestions
    suggestions = []
    
    # Budget & Savings Analysis
    analyze_budget_savings(suggestions, transactions, user_profile)
    
    # Suggestions based on cluster insights
    for insight in cluster_insights:
        suggestions.append(insight)
    
    return suggestions

def find_optimal_clusters(X):
    from sklearn.metrics import silhouette_score
    
    best_k = 2
    best_score = -1
    for k in range(2, 10):
        kmeans = KMeans(n_clusters=k, random_state=42).fit(X)
        score = silhouette_score(X, kmeans.labels_)
        if score > best_score:
            best_score = score
            best_k = k
    return best_k

def analyze_clusters(transactions, clusters):
    insights = []
    for cluster_id in set(clusters):
        cluster_transactions = [t for t, c in zip(transactions, clusters) if c == cluster_id]
        avg_amount = np.mean([t['amount'] for t in cluster_transactions])
        common_category = max(set(t['category'] for t in cluster_transactions), key=lambda x: sum(1 for t in cluster_transactions if t['category'] == x))
        
        insights.append(f"Cluster {cluster_id}: Average spend ${avg_amount:.2f}, most common category: {common_category}")
    
    return insights

def analyze_budget_savings(suggestions, transactions, user_profile):
    # Savings Goal
    if user_profile['savings_goal']:
        current_savings = sum(t['amount'] for t in transactions if t['category'] == 'Savings')
        if current_savings < user_profile['savings_goal']:
            suggestions.append(f"You're ${user_profile['savings_goal'] - current_savings} short of your savings goal. Consider reducing spending in your highest expense category.")

    # Monthly Budget
    if user_profile['monthly_budget']:
        total_spending = sum(t['amount'] for t in transactions)
        if total_spending > user_profile['monthly_budget']:
            suggestions.append(f"You've exceeded your monthly budget by ${total_spending - user_profile['monthly_budget']}. Try to cut back on non-essential expenses.")
