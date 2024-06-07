FROM ultralytics/ultralytics:8.2.20-python
WORKDIR '/app'
COPY ./requirements.txt ./
RUN pip install --no-cache-dir --upgrade -r requirements.txt
COPY ./ ./
EXPOSE 8000
CMD [ "python", "-m", "main" ]