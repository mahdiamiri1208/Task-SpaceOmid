import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Pagination,
  Box,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RefreshIcon from "@mui/icons-material/Refresh";
import { getAllUsers } from "../services/UserService";
import { useNavigate } from "react-router-dom";

export default function UserListTable({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const fetchUsers = () => {
    setLoading(true);
    setFetchError("");
    getAllUsers()
      .then((res) => {
        setUsers(res.users);
        setItemsPerPage(res.perPage);
        setTotalPages(Math.ceil(res.users.length / res.perPage));
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setFetchError("Failed to fetch users. Please try again later.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const paginatedUsers = users.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        mt={5}
        gap={2}
      >
        <Box sx={{ color: "error.main", fontSize: 16 }}>{fetchError}</Box>
        <Tooltip title="Try again">
          <IconButton onClick={fetchUsers} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "70%" }}>
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          overflowX: "auto",
          mt: 2,
        }}
      >
        <Table sx={{ minWidth: 200 }}>
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell align="center">View</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar src={user.avatar} sx={{ width: 40, height: 40 }} />
                </TableCell>
                <TableCell>
                  {user.first_name} {user.last_name}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton
                      onClick={() => navigate(`/details/user/${user.id}`)}
                    >
                      <VisibilityIcon color="action" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
