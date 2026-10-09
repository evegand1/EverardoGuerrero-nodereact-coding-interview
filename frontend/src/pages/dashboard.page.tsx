import React, { FC, useState, useEffect, useMemo } from "react";
import { RouteComponentProps } from "@reach/router";
import { IUserProps } from "../dtos/user.dto";
import { UserCard } from "../components/users/user-card";
import { CircularProgress } from "@mui/material";

import { BackendClient } from "../clients/backend.client";

const backendClient = new BackendClient();

export const DashboardPage: FC<RouteComponentProps> = () => {
  // Data states
  const [users, setUsers] = useState<IUserProps[]>([]);
  
  // UI states
  const [loading, setLoading] = useState<boolean>(true); // Only for initial page load
  const [searchTerm, setSearchTerm] = useState('');

  // 1. KEEP THIS: It loads all users when the page opens
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await backendClient.getAllUsers();
        if (isMounted) {
          setUsers(result.data);
        }
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. INSTANT FILTERING: Changing to useMemo to optimize
  const filteredUsers = useMemo(() => {
    const cleanSearchTerm = searchTerm.toLowerCase().trim();
    
    // If search is empty, just return the full list
    if (!cleanSearchTerm) return users;

    return users.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return fullName.includes(cleanSearchTerm);
    });
  }, [users, searchTerm]); // Only recalculate when users data or searchTerm changes

  // 2. LIMIT THE RENDERED CARDS to prevent browser lag
  // Change 50 to whatever number looks good on your screen
  const displayedUsers = filteredUsers.slice(0, 50);

  const clearSearch = () => {
    setSearchTerm('');
  };

  // 3. Initial loading spinner
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress size="60px" />
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "30px", padding: "0 20px" }}>
      {/* Search Bar (No <form> needed anymore) */}
      <div style={{ display: 'flex', gap: '10px', paddingTop: '60px', marginBottom: '20px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Start typing a name..."
          style={{ flex: 1, padding: '8px', maxWidth: '400px' }}
        />
        {searchTerm && (
          <button type="button" onClick={clearSearch}>
            Clear Search
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {displayedUsers.length > 0 ? (
          displayedUsers.map((user) => <UserCard key={user.id} {...user} />)
        ) : (
          <p>No users match your search.</p>
        )}
      </div>
    </div>
  );
};
