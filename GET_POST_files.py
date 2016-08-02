# A simple HTTP server at 8000
# Serves all files in its directory and subdirectories.
#
# Data that is POSTed is written to a file of the name specified in the
# URL such that it is available after that under the same name.



import mimetypes
import string,cgi,time
from os import curdir, sep
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
#import pri
# add mimetypes for ttf, woff...

class MyHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        try:
            f = open(curdir + sep + self.path, "rb")
            self.send_response(200)
            self.send_header('Content-type', mimetypes.guess_type(self.path)[0])
            print 'Content-type', mimetypes.guess_type(self.path)[0]
            self.end_headers()
            self.wfile.write(f.read())
            f.close()
            return
        except IOError:
            self.send_error(404,'File Not Found: %s' % self.path)
            
    def do_POST(self):
        global rootnode
        try:
            self.send_response(200)
            self.end_headers()
            content_len = int(self.headers.getheader('content-length', 0));
            post_body = self.rfile.read(content_len)
            print "'",self.path[1:],"'", ", filecontent", content_len, ": -omitted -"#", post_body  #
            f = open(self.path[1:], "w")
            f.write(post_body)
            f.close()
        except :
            pass

def main():
    try:
        # Add file types unknown to mimetypes here so that they are reported correctly to the browser
        mimetypes.add_type("application/font-woff", ".woff")
        mimetypes.add_type("application/octet-stream", ".ttf")
        
        
        server = HTTPServer(('', 8000), MyHandler)
        print 'started GET_POST_files server at port 8000. supported operations: GET /file, POST /file <content>'
        server.serve_forever()
    except KeyboardInterrupt:
        print '^C received, shutting down server'
        server.socket.close()

if __name__ == '__main__':
    main()

