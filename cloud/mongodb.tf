# Retrieves the organization associated with the project ID
data "mongodbatlas_roles_org_id" "test" {}

resource "mongodbatlas_project" "project" {
  name             = "qa-pup"
  org_id           = data.mongodbatlas_roles_org_id.test.org_id
  project_owner_id = var.mongodb_project_owner_id
}

resource "mongodbatlas_cluster" "main_cluster" {
  project_id   = mongodbatlas_project.project.id
  name         = "main"
  cluster_type = "REPLICASET"
  replication_specs {
    num_shards = 1
    regions_config {
      region_name     = var.mongodb_region
      electable_nodes = 3
      priority        = 7
      read_only_nodes = 0
    }
  }

  provider_name               = "TENANT"
  provider_region_name        = var.mongodb_region
  backing_provider_name       = "AWS"
  provider_instance_size_name = "M0"
}

resource "mongodbatlas_project_ip_access_list" "allow_all_ips" {
  project_id = mongodbatlas_project.project.id
  cidr_block = "0.0.0.0/0"
  comment    = "allow connections from anywhere"
}

resource "mongodbatlas_database_user" "admin" {
  # https://registry.terraform.io/providers/mongodb/mongodbatlas/latest/docs/resources/database_user#password
  password = var.mongodb_pass

  username           = var.mongodb_user
  project_id         = mongodbatlas_project.project.id
  auth_database_name = "admin"

  roles {
    role_name     = "atlasAdmin"
    database_name = "admin"
  }
}