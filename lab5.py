import socket, ssl
from bs4 import BeautifulSoup

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

def send_web_engine_request():
    # Dummy function
    return "WIP"

# host = "protv.md"
# path = "/"

# html_body = send_https_request(host, path)
# print(html_body)

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

