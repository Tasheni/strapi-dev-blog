/* import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Box,
  BaseCheckbox,
  Typography,
  Alert,
  Loader,
  Flex,
  IconButton,
  Link,
} from "@strapi/design-system";
import axios from "../utils/axiosInstance";
import { Pencil, Trash, Plus } from "@strapi/icons";

interface Repo {
  id: number;
  name: string;
  shortDescription: string;
  url: string;
  projectId?: number;
}

const RepoComponent = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();
  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/github-projects/repos");
        setRepos(response.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  if (error) {
    return (
      <Alert
        closeLabel="Close alert"
        title="Error fetching repositories"
        variant="danger"
      >
        {error.toString()}
      </Alert>
    );
  }

  if (loading) {
    return <Loader />;
  }

  const handleEditClick = (projectId: number) => {
    history.push(
      `/content-manager/collection-types/plugin::github-projects.project/${projectId}`
    );
  };

  const allChecked = selectedRepos.length === repos.length;
  const isIndeterminate = selectedRepos.length > 0 && !allChecked;


  const handleSelectAllChange = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedRepos(repos.map(repo => repo.id));
    } else {
      setSelectedRepos([]);
    }
  };
  return (
    <Box padding={8} background="neutral100">
      <Table colCount={5} rowCount={repos.length + 1}>
        <Thead>
          <Tr>
            <Th>
              <BaseCheckbox
                aria-label="Select all entries"
                indeterminate={isIndeterminate}
                onValueChange={handleSelectAllChange}
                value={allChecked}
              />
            </Th>
            <Th>
              <Typography variant="sigma">Name</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Description</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">URL</Typography>
            </Th>
            <Th>
              <Typography variant="sigma">Actions</Typography>
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {repos.map((repo) => (
            <Tr key={repo.id}>
              <Td>
                <BaseCheckbox
                  checked={selectedRepos.includes(repo.id)}
                  onValueChange={(isChecked:boolean) => {
                    setSelectedRepos((currentSelected) => {
                      if (isChecked) {
                        return [...currentSelected, repo.id];
                      } else {
                        return currentSelected.filter((id) => id !== repo.id);
                      }
                    });
                  }}
                  value={selectedRepos.includes(repo.id)} 
                />
              </Td>
              <Td>
                <Typography textColor="neutral800">{repo.name}</Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  {repo.shortDescription}
                </Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  <Link href={repo.url}>{repo.url}</Link>
                </Typography>
              </Td>
              <Td>
                <Flex>
                  {repo.projectId ? (
                    <IconButton
                      onClick={() =>
                        repo.projectId !== undefined &&
                        handleEditClick(repo.projectId)
                      }
                      label="Edit"
                      noBorder
                      icon={<Pencil />}
                    />
                  ) : (
                    <IconButton label="Add" noBorder icon={<Plus />} />
                  )}
                  <IconButton label="Delete" noBorder icon={<Trash />} />
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default RepoComponent;
 */

// Importing necessary modules and components from React, React Router, Strapi Design System, Axios, and icon assets.
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Table, Thead, Tbody, Tr, Td, Th, Box, BaseCheckbox, Typography, Alert, Loader, Flex, IconButton, Link,
} from "@strapi/design-system";
import axios from "../utils/axiosInstance";
import { Pencil, Trash, Plus } from "@strapi/icons";

// Interface declaration for Repo objects
interface Repo {
  id: number; // Unique identifier
  name: string; // Name of the repository
  shortDescription: string; // A brief description of the repository
  url: string; // URL to access the repository
  projectId?: number; // Optional project ID associated with the repository
}

const RepoComponent = () => {
  // State hooks for various component states
  const [repos, setRepos] = useState<Repo[]>([]); // State to hold an array of repo objects
  const [loading, setLoading] = useState(false); // State to track if data is being loaded
  const [error, setError] = useState<string | null>(null); // State to hold any error messages
  const history = useHistory(); // Hook to programmatically navigate using React Router
  const [selectedRepos, setSelectedRepos] = useState<number[]>([]); // State to track selected repos by their IDs

  // Effect hook to fetch repository data on component mount
  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true); // Begin loading state
      try {
        const response = await axios.get("/github-projects/repos"); // Fetch repos
        setRepos(response.data); // Update repos state with fetched data
      } catch (error: any) {
        setError(error.message); // Set error state in case of failure
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchRepos(); // Invoke the async fetch function
  }, []); // Empty dependency array means this effect runs once on mount

  // Conditional rendering in case of an error
  if (error) {
    return (
      <Alert
        closeLabel="Close alert"
        title="Error fetching repositories"
        variant="danger"
      >
        {error.toString()} // Display the error message
      </Alert>
    );
  }

  // Conditional rendering when data is being loaded
  if (loading) {
    return <Loader />; // Show a loading indicator
  }

  // Function to handle navigation to the edit page of a project
  const handleEditClick = (projectId: number) => {
    history.push(
      `/content-manager/collection-types/plugin::github-projects.project/${projectId}`
    );
  };

  // Logic to determine the checked state of the "Select All" checkbox
  const allChecked = selectedRepos.length === repos.length;
  const isIndeterminate = selectedRepos.length > 0 && !allChecked;

  // Function to handle changes in the "Select All" checkbox
  const handleSelectAllChange = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedRepos(repos.map(repo => repo.id)); // Select all repos
    } else {
      setSelectedRepos([]); // Deselect all
    }
  };

  return (
    <Box padding={8} background="neutral100"> 
      <Table colCount={5} rowCount={repos.length + 1}>
        <Thead> 
          <Tr> 
            <Th> 
              <BaseCheckbox
                aria-label="Select all entries"
                indeterminate={isIndeterminate} // Indeterminate state based on partial selection
                onValueChange={handleSelectAllChange} // Handler for change events
                value={allChecked} // Checked state based on all repos being selected
              />
            </Th>
            {/* Additional table headers for repo properties */}
            <Th><Typography variant="sigma">Name</Typography></Th>
            <Th><Typography variant="sigma">Description</Typography></Th>
            <Th><Typography variant="sigma">URL</Typography></Th>
            <Th><Typography variant="sigma">Actions</Typography></Th>
          </Tr>
        </Thead>
        <Tbody> 
          {repos.map((repo) => ( 
            <Tr key={repo.id}> 
              <Td>
                <BaseCheckbox
                  checked={selectedRepos.includes(repo.id)} // Checked state based on selection
                  onValueChange={(isChecked:boolean) => { // Handler for change events with explicit boolean type
                    setSelectedRepos((currentSelected) => {
                      if (isChecked) {
                        return [...currentSelected, repo.id]; // Add repo ID to selection
                      } else {
                        return currentSelected.filter((id) => id !== repo.id); // Remove repo ID from selection
                      }
                    });
                  }}
                  value={selectedRepos.includes(repo.id)} // Controlled checked state
                />
              </Td>
              {/* Additional cells for repo properties and actions */}
              <Td>
                <Typography textColor="neutral800">{repo.name}</Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  {repo.shortDescription}
                </Typography>
              </Td>
              <Td>
                <Typography textColor="neutral800">
                  <Link href={repo.url}>{repo.url}</Link>
                </Typography>
              </Td>
              <Td>
                <Flex>
                  {repo.projectId ? ( // Conditional rendering based on presence of projectId
                    <IconButton
                      onClick={() =>
                        repo.projectId !== undefined &&
                        handleEditClick(repo.projectId) // Navigate to edit page if projectId is present
                      }
                      label="Edit"
                      noBorder
                      icon={<Pencil />}
                    />
                  ) : (
                    <IconButton label="Add" noBorder icon={<Plus />} /> 
                  )}
                  <IconButton label="Delete" noBorder icon={<Trash />} /> 
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default RepoComponent;
