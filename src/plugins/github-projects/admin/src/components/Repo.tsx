import React, { useEffect, useState } from "react";
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
import ConfirmDialog from "./ConfirmDialog";
import BulkActions from "./BulkActions"

interface Repo {
  id: number;
  name: string;
  shortDescription: string;
  url: string;
  projectId: number | null;
}

interface AlertData {
  title: string;
  message: string;
  variant: "success" | "danger";
}

const RepoComponent = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();
  const [selectedRepos, setSelectedRepos] = useState<number[]>([]);
  const [alert, setAlert] = useState<AlertData | undefined>(undefined);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [repoToBeDeleted, setRepoToBeDeleted] = useState<Repo | null>(null);

  const showAlert = (alert: AlertData) => {
    setAlert(alert);
    setTimeout(() => {
      setAlert(undefined);
    }, 5000);
  };

  const createProject = async (repo: Repo) => {
    const response = await axios.post("/github-projects/project", repo);
    if (response && response.data) {
      setRepos(
        repos.map((item) =>
          item.id !== repo.id
            ? item
            : {
                ...item,
                projectId: response.data.id,
              }
        )
      );
      showAlert({
        title: "Project created Successfully",
        message: `Successfully created project ${response.data.title}`,
        variant: "success",
      });
    } else {
      showAlert({
        title: "An error occured",
        message: "error creating the project. Please retry",
        variant: "danger",
      });
    }
  };

  const deleteProject = async (repoToDelete: Repo) => {
    try {
      if (repoToDelete.projectId !== null) {
        await axios.delete(
          `/github-projects/project/${repoToDelete.projectId}`
        );
        setRepos((currentRepos) =>
          currentRepos.map((repo) =>
            repo.id === repoToDelete.id ? { ...repo, projectId: null } : repo
          )
        );
        showAlert({
          title: "Project deleted",
          message: `Successfully deleted project.`,
          variant: "success",
        });
      }
    } catch (error) {
      showAlert({
        title: "An error occurred",
        message: "Error deleting the project. Please retry.",
        variant: "danger",
      });
    }
  };

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

  const handleDeleteClick = (repo: Repo) => {
    setRepoToBeDeleted(repo);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (repoToBeDeleted && repoToBeDeleted.projectId) {
      await deleteProject(repoToBeDeleted);
      setRepos(repos.filter((r) => r.id !== repoToBeDeleted.id));
      setIsConfirmDialogOpen(false);
    }
  };

  const handleEditClick = (projectId: number) => {
    history.push(
      `/content-manager/collection-types/plugin::github-projects.project/${projectId}`
    );
  };

  const allChecked = selectedRepos.length === repos.length;
  const isIndeterminate = selectedRepos.length > 0 && !allChecked;

  const handleSelectAllChange = (isChecked: boolean) => {
    if (isChecked) {
      setSelectedRepos(repos.map((repo) => repo.id));
    } else {
      setSelectedRepos([]);
    }
  };

  return (
    <Box padding={8} background="neutral100">
      {alert && (
        <div style={{ position: "absolute", top: 0, left: "14%", zIndex: 10 }}>
          <Alert
            closeLabel="Close alert"
            title={alert.title}
            variant={alert.variant}
          >
            {alert.message}
          </Alert>
        </div>
      )}
      
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
                  onValueChange={(isChecked: boolean) => {
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
                    <>
                      <IconButton
                        label="Edit"
                        noBorder
                        icon={<Pencil />}
                        onClick={() => {
                          if (typeof repo.projectId === "number") {
                            handleEditClick(repo.projectId);
                          }
                        }}
                      />
                      <IconButton
                        label="Delete"
                        noBorder
                        icon={<Trash />}
                        onClick={() => handleDeleteClick(repo)}
                      />
                    </>
                  ) : (
                    <IconButton
                      label="Add"
                      noBorder
                      icon={<Plus />}
                      onClick={() => createProject(repo)}
                    />
                  )}
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsConfirmDialogOpen(false)}
      />
    </Box>
  );
};

export default RepoComponent;
