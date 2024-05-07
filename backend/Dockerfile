# FROM python:3.9

# WORKDIR /backend

# COPY ./requirements.txt /backend/requirements.txt
# RUN pip install --no-cache-dir --upgrade -r /backend/requirements.txt

# COPY ./app /backend/app
# COPY ./alembic /backend/alembic

# # Set the working directory
# WORKDIR /myapp

# # Create and switch to a non-root user
# RUN useradd -m myuser
# USER myuser

# # Copy application code with appropriate ownership
# COPY --chown=myuser:myuser . .

# # Inform Docker that the container listens on the specified port at runtime.
# EXPOSE 8000

# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Define a base stage with a Debian Bookworm base image that includes the latest glibc update
FROM python:3.12-bookworm as base

WORKDIR /backend

# Update system and specifically upgrade libc-bin to the required security patch version
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && apt-get install -y libc-bin=2.36-9+deb12u7 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies in /.venv
COPY requirements.txt .
RUN python -m venv /.venv \
    && . /.venv/bin/activate \
    && pip install --upgrade pip \
    && pip install -r requirements.txt

# Define a second stage for the runtime, using the same Debian Bookworm slim image
FROM python:3.12-slim-bookworm as final

# Upgrade libc-bin in the final stage to ensure security patch is applied
RUN apt-get update && apt-get install -y libc-bin=2.36-9+deb12u7 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy the virtual environment from the base stage
COPY --from=base /.venv /.venv

# Set environment variable to ensure all python commands run inside the virtual environment
ENV PATH="/.venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1

# Set the working directory
WORKDIR /backend

# Create and switch to a non-root user
RUN useradd -m myuser
USER myuser

# Copy application code with appropriate ownership
COPY --chown=myuser:myuser . .

# Inform Docker that the container listens on the specified port at runtime.
EXPOSE 8000

# Use ENTRYPOINT to specify the executable when the container starts.
ENTRYPOINT ["uvicorn", "app.main:app", "--reload", "--host", "0.0.0.0", "--port", "8000"]