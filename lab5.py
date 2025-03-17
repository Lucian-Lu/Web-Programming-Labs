import socket, ssl
from bs4 import BeautifulSoup


# Headers to prevent getting the bot verification redirect
headers_get = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'DNT': '1',
    'Connection': 'close'
}


def send_https_request(host, path):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)   
    # Wrapping the socket for HTTPS connection
    s_socket = ssl.wrap_socket(sock)
    
    try:
        # Connecting to the server on the https port
        s_socket.connect((host, 443))
        request = f"GET {path} HTTP/1.1\r\nHost: {host}\r\nConnection: close\r\n\r\n"
        s_socket.sendall(request.encode())
        
        # Receive the response in chunks
        response = b""
        while True:
            chunk = s_socket.recv(4096)
            if not chunk:
                break
            response += chunk
        
        response_str = response.decode('utf-8')
        # Split the response into headers and body
        header, _, body = response_str.partition("\r\n\r\n")
        
        return body
    finally:
        s_socket.close()

def return_help_info():
    # Return help info
    return "go2web -u <URL>         # make an HTTP request to the specified URL and print the response\ngo2web -s <search-term> # make an HTTP request to search the term using your favorite search engine and print top 10 results\ngo2web -h               # show this help"


# Function to build the https request data
def build_headers(path, host):
    request_line = f"GET {path} HTTP/1.1\r\n"
    header_lines = f"Host: {host}\r\n"
    for key, value in headers_get.items():
        header_lines += f"{key}: {value}\r\n"
    header_lines += "\r\n"
    return request_line + header_lines


# Function that will use duckduckgo html search to return page data
def send_web_engine_request(query):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s_socket = ssl.wrap_socket(sock)
    query = '+'.join(query.split())
    host = 'html.duckduckgo.com'
    path = '/html?q=' + query
    request_data = build_headers(path, host)
    
    try:
        s_socket.connect((host, 443))
        s_socket.sendall(request_data.encode())
        response = b""
        while True:
            chunk = s_socket.recv(4096)
            if not chunk:
                break
            response += chunk
        response_str = response.decode('utf-8', errors='replace')
        header, _, body = response_str.partition("\r\n\r\n")
    finally:
        s_socket.close()

    soup = BeautifulSoup(body, "html.parser")
    output = []

    for result in soup.find_all('a', {'class': 'result__a'}):
        title = result.get_text(strip=True)
        url = result.get('href')
        output.append({'title': title, 'url': url})
    return output

    
if __name__ == "__main__":
    while True:
        command = input("Enter a command: ")
        split_command = command.split(" ")
        try:
            cmd_1 = split_command[0]
            cmd_2 = split_command[1]
        except IndexError:
            print("Invalid command! Use 'go2web -h' to view available commands")
            continue

        if cmd_1 != "go2web":
            print("Invalid application prefix! Correct prefix is 'go2web'")
            continue

        if cmd_2 not in ["-u", "-s", "-h"]:
            print("Invalid command! Use 'go2web -h' to view available commands")
            continue
        
        if split_command[1] == "-h":
            cmd_3 = None
        else:
            try:
                cmd_3 = split_command[2]
            except IndexError:
                print("Search term needs to be specified!")
                continue

        if cmd_2 == "-u":
            try:
                host, path = cmd_3.split("://")[-1].split("/", 1)
                print(host, path)
                response = send_https_request(host, path)
                print(response)
            except:
                print("Error occurred = ", response)
        elif cmd_2 == "-s":
            response = send_web_engine_request()
            print(response)
        if cmd_2 == "-h":
            response = return_help_info()
            print(response)

