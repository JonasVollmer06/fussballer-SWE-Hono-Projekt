
# Aufruf:   docker buildx bake [trixie|alpine]

# Dateiformate: HCL ( = HashiCorp Configuration Language), YAML (wie in Docker Compose) oder JSON
# HCL ist maechtiger und flexibler als YAML oder JSON.

# https://docs.docker.com/build/bake/introduction
# https://docs.docker.com/build/bake/reference

group "default" {
  targets = ["hardened"]
  # targets = ["hardened", "trixie", "alpine"]
}
target "hardened" {
  tags = ["docker.io/juergenzimmermann/fussballer:2026.4.1-hardened"]
  #dockerfile = "Dockerfile"
  #no-cache = true
}

target "trixie" {
  tags = ["docker.io/juergenzimmermann/fussballer:2026.4.1-trixie"]
  dockerfile = "Dockerfile.trixie"
}

target "alpine" {
  tags = ["docker.io/juergenzimmermann/fussballer:2026.4.1-alpine"]
  dockerfile = "Dockerfile.alpine"
}
