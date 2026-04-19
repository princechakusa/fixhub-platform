let seq = 4032;

function getNextTicketId() {
  seq++;
  return 'TK-' + seq;
}

module.exports = { getNextTicketId };